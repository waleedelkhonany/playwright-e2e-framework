import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/config/env';
import type { Booking } from '../../src/api/BookingClient';

const booking: Booking = {
  firstname: 'Sara',
  lastname: 'Ahmed',
  totalprice: 450,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

test.describe('Booking API', () => {
  test('API-001 health check responds', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('API-002 full CRUD: create, read, update, delete', async ({ bookings }) => {
    // Create
    const created = await bookings.create(booking);
    expect(created.status()).toBe(200);
    const { bookingid, booking: saved } = await created.json();
    expect(bookingid).toEqual(expect.any(Number));
    expect(saved).toMatchObject(booking);

    // Read
    const read = await bookings.get(bookingid);
    expect(read.status()).toBe(200);
    expect(await read.json()).toMatchObject(booking);

    // Update (needs a token)
    const token = await bookings.token(env.apiUsername, env.apiPassword);
    const changed = { ...booking, totalprice: 520, additionalneeds: 'Late checkout' };
    const updated = await bookings.update(bookingid, changed, token);
    expect(updated.status()).toBe(200);
    expect(await updated.json()).toMatchObject(changed);

    // Delete, then confirm it is gone
    const deleted = await bookings.delete(bookingid, token);
    expect(deleted.status()).toBe(201);
    expect((await bookings.get(bookingid)).status()).toBe(404);
  });

  test('API-003 update without a token is forbidden', async ({ bookings }) => {
    const created = await bookings.create(booking);
    const { bookingid } = await created.json();
    const res = await bookings.update(bookingid, { ...booking, totalprice: 1 }, 'invalid-token');
    expect(res.status()).toBe(403);
  });

  test('API-004 delete without a token is forbidden', async ({ bookings }) => {
    const created = await bookings.create(booking);
    const { bookingid } = await created.json();
    expect((await bookings.delete(bookingid)).status()).toBe(403);
  });

  test('API-005 auth with wrong credentials returns no token', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('API-006 unknown booking returns 404', async ({ bookings }) => {
    expect((await bookings.get(999999999)).status()).toBe(404);
  });
});
