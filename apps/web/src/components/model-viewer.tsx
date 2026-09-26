import { useEffect, useRef, useState } from 'react'
import { Box, Download } from 'lucide-react'
import { Mesh, Texture, type Material, type Object3D } from 'three'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

type ModelViewerProps = {
  modelUrl: string | null
  modelName?: string
}

const disposeMaterial = (material: Material) => {
  for (const value of Object.values(material)) {
    if (value instanceof Texture) value.dispose()
  }
  material.dispose()
}

const disposeObject = (root: Object3D) => {
  root.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose()
      if (Array.isArray(object.material)) {
        object.material.forEach((m) => disposeMaterial(m))
      } else {
        disposeMaterial(object.material)
      }
    }
  })
}

export const ModelViewer = ({ modelUrl, modelName }: ModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewerError, setViewerError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!modelUrl || !container) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let renderer: import('three').WebGLRenderer | null = null
    let controls:
      | import('three/examples/jsm/controls/OrbitControls.js').OrbitControls
      | null = null
    let scene: import('three').Scene | null = null
    let environment: import('three').Texture | null = null
    let model: import('three').Object3D | null = null

    setIsLoading(true)
    setViewerError(null)

    const initialize = async () => {
      const [THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] =
        await Promise.all([
          import('three'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ])
      if (cancelled) return

      scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.className = 'block h-full w-full'
      container.replaceChildren(renderer.domElement)

      const room = new RoomEnvironment()
      const pmrem = new THREE.PMREMGenerator(renderer)
      environment = pmrem.fromScene(room).texture
      scene.environment = environment
      room.dispose()
      pmrem.dispose()

      scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5))
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
      keyLight.position.set(4, 6, 5)
      scene.add(keyLight)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.autoRotate = true
      controls.autoRotateSpeed = 1.5

      const resize = () => {
        if (!renderer) return
        const width = Math.max(container.clientWidth, 1)
        const height = Math.max(container.clientHeight, 1)
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(container)
      resize()

      const gltf = await new GLTFLoader().loadAsync(modelUrl)
      model = gltf.scene
      if (cancelled) {
        disposeObject(model)
        return
      }

      const bounds = new THREE.Box3().setFromObject(model)
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      model.position.sub(center)
      scene.add(model)

      const maxDimension = Math.max(size.x, size.y, size.z, 0.01)
      const verticalFov = THREE.MathUtils.degToRad(camera.fov)
      let distance = maxDimension / (2 * Math.tan(verticalFov / 2))
      if (camera.aspect < 1) distance /= camera.aspect
      distance *= 1.35
      camera.position.set(distance * 0.75, distance * 0.45, distance)
      camera.near = Math.max(distance / 100, 0.001)
      camera.far = distance * 100
      camera.updateProjectionMatrix()
      controls.minDistance = distance * 0.2
      controls.maxDistance = distance * 5
      controls.target.set(0, 0, 0)
      controls.update()

      renderer.setAnimationLoop(() => {
        controls?.update()
        if (renderer && scene) renderer.render(scene, camera)
      })
      setIsLoading(false)
    }

    void initialize().catch(() => {
      if (cancelled) return
      setIsLoading(false)
      setViewerError('The 3D model could not be rendered.')
    })

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      renderer?.setAnimationLoop(null)
      controls?.dispose()
      if (model) disposeObject(model)
      environment?.dispose()
      renderer?.dispose()
      renderer?.domElement.remove()
    }
  }, [modelUrl])

  const downloadModel = () => {
    if (!modelUrl) return
    const link = document.createElement('a')
    link.href = modelUrl
    link.download = modelName ?? 'model.glb'
    link.click()
  }

  return (
    <Card className='h-full min-h-0 min-w-0 shadow-lg shadow-primary/10'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl'>3D model</CardTitle>
        <CardDescription>{modelName ?? 'Model preview'}</CardDescription>
      </CardHeader>
      <CardContent className='relative min-h-0 flex-1 p-0'>
        {modelUrl && (
          <>
            <div
              ref={containerRef}
              className='h-full min-h-110 w-full bg-muted/40 lg:min-h-0'
            />
            <Button
              type='button'
              size='sm'
              variant='secondary'
              className='absolute top-4 right-4 shadow-sm'
              onClick={downloadModel}
            >
              <Download />
              Download model
            </Button>
            {isLoading && !viewerError && (
              <div className='absolute inset-0 grid place-items-center bg-background/80'>
                <Spinner className='size-8' />
              </div>
            )}
            {viewerError && (
              <div className='absolute inset-0 grid place-items-center bg-background/90 px-6 text-center'>
                <div className='max-w-sm'>
                  <Box className='mx-auto size-12 text-destructive' />
                  <p className='mt-4 font-medium text-destructive'>
                    Unable to display model
                  </p>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {viewerError}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
