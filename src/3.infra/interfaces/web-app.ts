import { Route } from '@/2.presentation/types/route'

export default interface WebApp {
  listen: (port: number, callback: () => void) => void
  setRoute: (route: Route) => void
}
