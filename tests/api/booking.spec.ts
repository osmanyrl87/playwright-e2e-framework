import { test, expect } from '@playwright/test';
import { BookingClient, newBooking } from '../../api/BookingClient';

test.describe('Restful-Booker API', () => {
  let client: BookingClient;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
  });

  test('health check responds @smoke', async () => {
    const res = await client.ping();
    expect(res.status()).toBe(201);
  });

  test('auth returns a token for valid credentials', async () => {
    const token = await client.createToken();
    expect(token).toMatch(/^\w+$/);
  });

  test('auth rejects bad credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'nope' } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('full booking lifecycle: create, read, update, patch, delete', async () => {
    const token = await client.createToken();
    const booking = newBooking();
    let id = 0;

    await test.step('create', async () => {
      const res = await client.create(booking);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.bookingid).toEqual(expect.any(Number));
      expect(body.booking).toEqual(booking);
      id = body.bookingid;
    });

    await test.step('read it back', async () => {
      const res = await client.get(id);
      expect(res.ok()).toBeTruthy();
      expect(await res.json()).toEqual(booking);
    });

    await test.step('find it with a name filter', async () => {
      const res = await client.list({ firstname: booking.firstname, lastname: booking.lastname });
      const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
      expect(ids).toContain(id);
    });

    const updated = { ...booking, totalprice: 310, additionalneeds: 'Late checkout' };

    await test.step('full update with PUT', async () => {
      const res = await client.update(id, updated, token);
      expect(res.status()).toBe(200);
      expect(await res.json()).toEqual(updated);
    });

    await test.step('partial update with PATCH', async () => {
      const res = await client.patch(id, { depositpaid: false }, token);
      expect(res.status()).toBe(200);
      expect(await res.json()).toEqual({ ...updated, depositpaid: false });
    });

    await test.step('delete and confirm it is gone', async () => {
      const del = await client.delete(id, token);
      // Restful-Booker documents 201 Created as its delete success code.
      expect(del.status()).toBe(201);
      expect((await client.get(id)).status()).toBe(404);
    });
  });

  test('updates without a token are forbidden', async () => {
    const created = await (await client.create(newBooking())).json();
    const res = await client.update(created.bookingid, newBooking({ totalprice: 1 }));
    expect(res.status()).toBe(403);

    const unchanged = await (await client.get(created.bookingid)).json();
    expect(unchanged.totalprice).toBe(245);
  });

  test('deletes without a token are forbidden', async () => {
    const created = await (await client.create(newBooking())).json();
    const res = await client.delete(created.bookingid);
    expect(res.status()).toBe(403);
    expect((await client.get(created.bookingid)).ok()).toBeTruthy();
  });

  test('unknown booking id returns 404', async () => {
    const res = await client.get(999_999_999);
    expect(res.status()).toBe(404);
  });
});
