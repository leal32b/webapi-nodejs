import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'group' })
export class PostgresGroupEntity {
  @PrimaryColumn({ type: 'text' })
    id: string

  @Column({ type: 'text', unique: true })
    name: string

  @Column({ type: 'timestamp' })
    createdAt: Date

  @Column({ type: 'timestamp' })
    updatedAt: Date
}
