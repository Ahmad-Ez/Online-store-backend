import { Product, ProductClass } from '../../models/product';

const store = new ProductClass();

const p_in: Product = {
  product_name: 'pears',
  price: 10,
  category: 'fruit',
};
const p_out: Product = {
  id: 1,
  product_name: 'pears',
  price: 10,
  category: 'fruit',
};

xdescribe('Product Model Structure', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a show_category method', () => {
    expect(store.show_category).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });
});

xdescribe('Product Model Functionality', () => {
  it('create method should add a product', async () => {
    const result = await store.create(p_in);
    expect(result).toEqual(p_out);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([p_out]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result).toEqual(p_out);
  });

  it('show_category method should return the correct product', async () => {
    const result = await store.show_category('fruit');
    expect(result).toEqual(p_out);
  });

  it('delete method should remove the product', async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
