import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
class Customers {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password: string;

  @Column('int')
  productFavoriteLimite: number;
}

export default Customers;
