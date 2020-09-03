import { HttpMethod } from '~/common/enums';

interface ApiRequest {
  url: string;
  method?: HttpMethod;
  body?: string | null;
  headers?: Headers;
}

export { ApiRequest };
