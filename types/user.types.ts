export type User = {
  user_id: number,
  user_name: string,
  role: string,
  passcode: 'admin' | 'cashier'
}
