import 'module-alias/register'
import app from '@/4.main/config/app'

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
