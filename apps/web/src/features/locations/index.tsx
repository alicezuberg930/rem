// _mock_
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import MapGeoJSONAnimation from './MapGeoJSONAnimation'
import MapHighlightByFilter from './MapHighlightByFilter'
import MapMarkersPopups from './MapMarkersPopups'
import MapChangeTheme from './change-theme'
import MapClusters from './clusters'
import { cities as CITIES } from './data/cities'
import { countries as COUNTRIES } from './data/countries'
import MapDraggableMarkers from './draggable-markers'
// sections
import MapHeatmap from './heatmap'
import MapInteraction from './interaction'
import MapSideBySide from './side-by-side'
import MapViewportAnimation from './viewport-animation'

const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
}

const baseSettings = {
  mapboxAccessToken: import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN,
  minZoom: 1,
}

const StyledMapContainer = ({ children }: { children: React.ReactNode }) => (
  <div className='relative z-0 h-[420px] overflow-hidden rounded-md border border-border sm:h-[480px] lg:h-[540px] [&_.mapboxgl-ctrl-bottom-right]:hidden [&_.mapboxgl-ctrl-logo]:hidden'>
    {children}
  </div>
)

export function Locations() {
  return (
    <>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Locations</h2>
            <p className='text-muted-foreground'>Interactive map examples</p>
          </div>
        </div>

        <div className='space-y-5'>
          <Card>
            <CardHeader>
              <CardTitle>Change Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapChangeTheme {...baseSettings} themes={THEMES} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Markers & Popups</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapMarkersPopups
                  {...baseSettings}
                  data={COUNTRIES}
                  mapStyle={THEMES.light}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Draggable Markers</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapDraggableMarkers
                  {...baseSettings}
                  mapStyle={THEMES.light}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GeoJSON Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapGeoJSONAnimation
                  {...baseSettings}
                  mapStyle={THEMES.satelliteStreets}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clusters</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapClusters {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapInteraction {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Viewport Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapViewportAnimation
                  {...baseSettings}
                  data={CITIES.filter((city) => city.state === 'Texas')}
                  mapStyle={THEMES.light}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlight By Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapHighlightByFilter
                  {...baseSettings}
                  mapStyle={THEMES.light}
                />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapHeatmap {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Side By Side</CardTitle>
            </CardHeader>
            <CardContent>
              <StyledMapContainer>
                <MapSideBySide {...baseSettings} />
              </StyledMapContainer>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
