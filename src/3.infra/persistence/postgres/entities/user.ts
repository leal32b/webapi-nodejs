import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'users' })
export class PgUser {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string
}
