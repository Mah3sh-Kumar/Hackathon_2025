-- BazaarLink Database Setup
-- Copy and paste this entire script into your Supabase SQL Editor

-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  address TEXT,
  gst_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  banner_url TEXT
);

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS sellers_user_id_idx ON sellers (user_id);
CREATE INDEX IF NOT EXISTS sellers_status_idx ON sellers (status);
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products (seller_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

-- Set up Row Level Security (RLS)
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for sellers table
CREATE POLICY "Allow individuals to read all sellers" 
  ON sellers FOR SELECT 
  USING (true);

CREATE POLICY "Allow individuals to insert their own seller profile" 
  ON sellers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individuals to update their own seller profile" 
  ON sellers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for products table
CREATE POLICY "Allow individuals to read all products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Allow sellers to insert their own products" 
  ON products FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow sellers to update their own products" 
  ON products FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow sellers to delete their own products" 
  ON products FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

-- Insert some sample data for testing
INSERT INTO sellers (user_id, business_name, status, description) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Sample Store', 'approved', 'A sample store for testing')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO products (seller_id, title, description, price, category, stock_quantity) 
SELECT 
  s.id,
  'Sample Product',
  'This is a sample product for testing',
  99.99,
  'Electronics',
  10
FROM sellers s 
WHERE s.user_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1; 