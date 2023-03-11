import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'users' })
export class PostgresUserEntity {
  @PrimaryColumn({ type: 'text' })
    id: string

  @Column({ type: 'text' })
    name: string

  @Column({ type: 'text', unique: true })
    email: string

  @Column({ type: 'boolean' })
    emailConfirmed: boolean

  @Column({ type: 'text' })
    password: string

  @Column({ type: 'text' })
    token: string
}
