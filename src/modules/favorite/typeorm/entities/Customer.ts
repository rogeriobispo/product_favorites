import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
class Customers {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  productFavoriteLimite: number;
}

export default Customers;
