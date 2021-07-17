import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favoriteProducts')
class FavoriteProducts {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  customerId!: string;

  @Column('varchar')
  productId!: string;
}

export default FavoriteProducts;
