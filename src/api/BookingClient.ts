import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

/** Thin client for the Restful Booker practice API. */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async token(username: string, password: string): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token, 'auth returns a token').toBeTruthy();
    return body.token;
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: token ? { Cookie: `token=${token}` } : {} });
  }
}
