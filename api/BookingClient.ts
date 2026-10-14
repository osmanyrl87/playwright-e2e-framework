import type { APIRequestContext, APIResponse } from '@playwright/test';

export type BookingDates = { checkin: string; checkout: string };

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
};

/**
 * Thin client for the Restful-Booker practice API.
 * Keeps endpoints and auth handling out of the test bodies.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  /** Public demo credentials documented by Restful-Booker. */
  async createToken(username = 'admin', password = 'password123'): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    const body = await res.json();
    return body.token as string;
  }

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get('/booking', { params });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.auth(token) });
  }

  patch(id: number, fields: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.auth(token) });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.auth(token) });
  }

  private auth(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }
}

/** Builds a booking with unique names so parallel runs never collide. */
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstname: `Osman${suffix}`,
    lastname: 'Automation',
    totalprice: 245,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-02', checkout: '2026-11-06' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
