import { useRef, memo } from 'react'
import type { GeoJSONSource } from 'mapbox-gl'
import Map, {
  Layer,
  type LngLatLike,
  type MapMouseEvent,
  type MapRef,
  Source,
} from 'react-map-gl/mapbox'
// components
import { MapBoxProps } from '@/components/map'
//
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from './layers'

// ----------------------------------------------------------------------

type ClusterFeature = {
  geometry?: {
    type?: string
    coordinates?: LngLatLike
  }
  properties?: {
    cluster_id?: number
  }
}

function MapClusters({ ...other }: MapBoxProps) {
  const mapRef = useRef<MapRef>(null)

  const onClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0] as ClusterFeature | undefined

    const clusterId = feature?.properties?.cluster_id

    if (typeof clusterId !== 'number') {
      return
    }

    const mapboxSource = mapRef.current?.getSource(
      'earthquakes'
    ) as GeoJSONSource

    mapboxSource.getClusterExpansionZoom(
      clusterId,
      (err: Error | null | undefined, zoom: number | null | undefined) => {
        if (err) {
          return
        }

        if (feature?.geometry?.type === 'Point') {
          mapRef.current?.easeTo({
            center: feature.geometry.coordinates,
            zoom: typeof zoom === 'number' && !Number.isNaN(zoom) ? zoom : 3,
            duration: 500,
          })
        }
      }
    )
  }

  return (
    <Map
      initialViewState={{
        latitude: 40.67,
        longitude: -103.59,
        zoom: 3,
      }}
      interactiveLayerIds={[clusterLayer.id || '']}
      onClick={onClick}
      ref={mapRef}
      {...other}
    >
      <Source
        id='earthquakes'
        type='geojson'
        data='https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
        cluster
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </Map>
  )
}

export default memo(MapClusters)
