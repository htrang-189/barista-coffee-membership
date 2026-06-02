PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  login_identifier TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  current_balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (current_balance >= 0)
);

CREATE TABLE IF NOT EXISTS package_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  package_size INTEGER NOT NULL,
  bonus_cups INTEGER NOT NULL,
  total_cups_added INTEGER NOT NULL,
  amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  created_by_admin_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_accounts(id),
  FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id),
  CHECK (package_size IN (10, 20, 30)),
  CHECK (bonus_cups >= 0),
  CHECK (total_cups_added > 0),
  CHECK (amount_paid_cents >= 0)
);

CREATE TABLE IF NOT EXISTS delivery_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  delivered_cups INTEGER NOT NULL DEFAULT 1,
  balance_after INTEGER NOT NULL,
  note TEXT,
  created_by_admin_id INTEGER NOT NULL,
  delivery_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_accounts(id),
  FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id),
  CHECK (delivered_cups = 1),
  CHECK (balance_after >= 0)
);

CREATE TABLE IF NOT EXISTS admin_action_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_accounts_phone ON customer_accounts(phone);
CREATE INDEX IF NOT EXISTS idx_customer_accounts_login_identifier ON customer_accounts(login_identifier);
CREATE INDEX IF NOT EXISTS idx_customer_accounts_current_balance ON customer_accounts(current_balance);
CREATE INDEX IF NOT EXISTS idx_package_purchases_customer_id ON package_purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_package_purchases_created_at ON package_purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_package_purchases_package_size ON package_purchases(package_size);
CREATE INDEX IF NOT EXISTS idx_delivery_history_customer_id ON delivery_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_history_delivery_date ON delivery_history(delivery_date);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_admin_user_id ON admin_action_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_created_at ON admin_action_logs(created_at);
