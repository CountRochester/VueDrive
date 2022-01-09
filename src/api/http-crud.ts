import { AxiosResponse, AxiosRequestConfig } from 'axios'
import http from './http'

export default <T extends Record<string, string>, U extends AxiosResponse, V, S extends AxiosResponse, M>(resource: string) => ({
  index(query: T = {} as T, path: string = ''): Promise<U> {
    return http.get(`/${path || resource}?${new URLSearchParams(query)}`)
  },

  show(id: string|number): Promise<U> {
    return http.get(`/${resource}/${id}`)
  },

  create(payload: M, config: AxiosRequestConfig = {}): Promise<S> {
    return http.post(`/${resource}`, payload, config)
  },

  update(payload: V, id: string|number, config: AxiosRequestConfig = {}): Promise<S> {
    return http.put(`/${resource}/${id}`, payload, config)
  },

  delete(id: string|number): Promise<S> {
    return http.delete(`/${resource}/${id}`)
  },
})