import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'users' })
export class PgUser {
  @PrimaryColumn()
    id: string

  @Column()
    name: string

  @Column({ unique: true })
    email: string

  @Column()
    emailConfirmed: boolean

  @Column()
    password: string

  @Column()
    token: string
}
