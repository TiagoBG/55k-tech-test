import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (sort: SortBy) => void
  deleteUser: (email: string) => void
  showColors: boolean
  users: User[]
}

export default function UsersList ({ changeSorting, deleteUser, showColors, users }: Props) {
  return (
        <table width='100%'>
            <thead>
                <tr>
                    <td>Foto</td>
                    <td className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre</td>
                    <td className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Apellido</td>
                    <td className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>País</td>
                    <td>Acciones</td>
                </tr>
            </thead>
            <tbody className={showColors ? 'table--showColors' : 'table'}>
                {
                    users.map((user, i) => {
                      const backgroundColor = i % 2 === 0 ? '#333' : '#555'
                      const color = showColors ? backgroundColor : 'transparent'

                      return (
                            <tr key={user.email} style={{ backgroundColor: color }}>
                                <td>
                                    <img src={user.picture.thumbnail} alt={user.login.username} />
                                </td>
                                <td>
                                    {user.name.first}
                                </td>
                                <td>
                                    {user.name.last}
                                </td>
                                <td>{user.location.country}</td>
                                <td>
                                    <button onClick={() => { deleteUser(user.email) }}>Borrar</button>
                                </td>
                            </tr>
                      )
                    })
                }
            </tbody>
        </table>
  )
}
