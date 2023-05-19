# Test

The objective of this technical test is to create sa similar application to the one provided. To achieve this, you must use tghe API provided by https://randomuser.me/.

Here are the steps to follow:

- [x] Fetch 100 rows of data using the API.
- [x] Display the data in a table format, similar to the example.
- [x] Provide the option to color rows as shown in the example.
- [x] Allow the data to be sorted by country as demostrated in the example.
- [x] Enable the ability to delete a row as shown in the example.
- [x] Implement a feature that allows the user to restore the initia state, meaning that all deleted rows will be recovered.
- [x] Handle any potential errors that may occur.
- [x] Implement a feature that alows the user to filter the data by country.
- [x] Avoid sorting users again the data when the user is changing filter by country.
- [x] Sort by clicking on the column header.
- [x] Provide a README.md file with instructions on how to run the application.


## Paso a paso

==1.== Creamos el proyecto usando vite: ```bash npm create vite@latest```. Seleccionamos las opciones de Typescript + SW para este caso (SW está hecho en Rust por lo que es un empaquetador mucho más rápido que Babel).

==2.== Instalamos pnpm: pnpm install e instalamos eslint: ```bash npx eslint --init```

==3.== Revisamos la configuración del eslint, asegurandonos que tenga el project y estas rules en particular:

```js
...
parserOptions: {
    ...
    project: './tsconfig.json'
  },
  ...
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/react-in-jsx-scope': 'off'
  }
  ...
```

==4.== Inicializamos el proyecto: ```bash pnpm run dev``` y revisamos que todo esté funcionando correctamente y solucionar bugs en caso de ser necesario.

==5.== Utilizar la API haciendo uso de fetch y por supuesto el useEffect. Muy importante tener en cuenta que para almacenar la información se necesita la esctructura del useState también:

```js
...
 const [users, setUsers] = useState()

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
      })
      .catch(err => { console.log(err) })
  }, [])
...
```

NOTA: Se puede imprimir la info en pantalla hacuiendo uiso del stringify:

```js
...
{
    JSON.stringify(users)
}
...
```

==6.== OJO: Un error muy común que hace perder mucho tiempo es que ahora en estos momentos empieces a tipar los datos inmediatamente de forma manual (porque en este caso usamos typescript). Se puede usar herramientas como quicktype para obtener el tipado a partir del JSON. Sin embargo en pruebas livecoding es mejor preguntar para ahorrar tiempo.
En este caso dejamos las opciones en quicktype de "Interfaces only" & "Verify JSON.parse results at runtime". Este código obtenido en quicktype se guarda como "types.d.ts" en la carpeta src. No olvidar importarlos en App component que es donde se usan para el useState.

NOTA: No refactorizar en este punto, es mejor sacar una solución funcional además que el tiempo en un livecoding es limitado.

==7.== Empezamos a crear el árbol de componentes al crear un componente UsersList para pintar la tabla que se necesita. Recordar usar las etiquetas table, thead, tbody, tr y td.

NOTA: Si se le pide usar typescript es importante no dejar ningún error de tipos. Ya por las últimas es mejor dejar un tipo any que un error.

==8.== En el caso de la tabla fue necesario hacer unos ajustes en los estilos en App.css para darle la propiedad de ```css with: 100%``` a la tabla. Recordar emplear HTML semántico en el momento de construir los componentes. 

==9.== Ahora se crea el botón para colorear las filas, es importante tener un estado para el cambio de colores de las mismas. Una vez creados el botón, el estado y la función, aparece un error de keys que se soluciona por ahora usando el indez del elemento en el array. Es muy importante ir solucionando estos errores de consola antes de continuar con el desarrollo de la prueba.

==10.== Ahora se trabaja en el sort, pero hay que tener mucho cuidado cuando se implementa:
- Se crearía otro estado para indicar si se muestra o no la tabla ordenada por país.
- Es muy importante tener en cuenta que el método sort muta el array original por lo que una vez ordenado, el array seguirá estando ordenado. Para dar ese efecto toggle se usa el spread operator ```js [...array]``` para crear una copia del array. O en las últimas versiones y debido al uso de SWC se puede usar el método toSorted() que automáticamente crea una copia del array sin tener que usar el spread operator.

NOTA: Para usar el toSorted() y debido a que estamos usando TypeScript, es necesario declarar el tipo de función dentro de nuestro archivo types, debido a que por temas de versiones es posible que este método actual no esté aún implementado en TypeScript por lo que agregamos esto en la parte superior del archivo, declarándola global para que quede disponible a todos los arrays del proyecto:

```js
declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[]
  }
}

 const sortedUsers = sortByCountry
    ? users.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
    : users

```

- El localeCompare es mucho más útil para comparar valores que no sean números!!

==11.== Ahora se trabaja en el feature de eliminar usuarios, para esto creamos una función que filtre los resulados de forma que pinte solo los que no coincidan con el elemento borrado. Esto con el fin de no hacer un llamado a la API de Delete/Get methods, sino que desde front realizamos esta funcionalidad. Para eso en el component App creamos la función y la enviamos como prop al UsersList component asi:

```js
interface Props {
  deleteUser: (email: string) => void
  showColors: boolean
  users: User[]
}

 const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }
```

NOTA: El key usando el index del array genera un bug ya que el elemento eliminado por ejemplo si era el index 1, el elemento index 2 pasa a ser el 1 y así generando comportamientos indeseados. Por ello se trata de usar keys que sean identificadores únicos del elemento como un uuid o el email en este caso. La declaración de la función en props hace alución a que se recibe el valor email de tipo string y se retorna void porque este es eliminado.

==12.== Para restaurar el estado inicial se podría cometer varios errores como: Crear un estado qué guarde el estado inicial o gfuardar el array inicial en una variable.
Este punto en específico quiere hacernos demostrar que realmente conocemos y sabemos de React.
Para ello usaremos una herramienta de React llamada useRef(), lo cual funcionaría un poco igual al useState() con la diferencia de que lo que busca el useRef es guardar un valor que se comparta entre renderizados. Lo implementaremos así:

```js
const originalUsers = useRef<User[]>([])

useEffect(() => {
    ...
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      ...
  }, [])

const handleReset = () => { setUsers(originalUsers.current) }
```

==13.== Para el filtro por país emplearemos un nuevo estado para tener en cuenta el input del país que el usuario desea filtrar. 
const [filterCountry, setFilterCountry] = useState<string | null>(null)

Luego se hace uso de la función filter, pero es importante tener en cuenta que el ordenar por país debe de funcionar en caso que se tenga algún filtro, es decir, que el orden por país depende del filtro del usuario. Por lo que estas líneas de código quedarían así:

```js
const filteredUsers = filterCountry !== null && filterCountry.length > 0
    ? users.filter((user) => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
    : users

  const sortedUsers = sortByCountry
    ? filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
    : filteredUsers
```

NOTA: Muy importante tener en cuenta que existen valores derivados de un estado, que es lo que se ha hecho con el filteredUsers, evitamos crear un estado para almacenarlos porque esta info se puede calcular desde otro estado (filterCountry). Hay que evitar al máximo crear estados por crear.

==14.== Para poder evitar hacer el sortingUsers de forma innecesaria, es decir, independientemente del filtro del usuario, se empleará useMemo. Tiene sentido que se ordenen los usuarios sí y sólo sí hay un cambio en ellos, es decir, si hay un cambio en la lista de los usuarios filtrados. Para ello el useMemo será usado en la variable sortedUsers:

```js
const filteredUsers = useMemo(() => {
    console.log('calculating filtered')
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
      : users
  }
  , [users, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculating sorted')
    return sortByCountry
      ? filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
      : filteredUsers
  }, [filteredUsers, sortByCountry])
```

- Ahora evitamos el re-renderizado cuando pintamos las filas pero en los demás casos cómo aplicamos el filter y obtenemos un "nuevo array" por eso se sigue llamando la función de sortingUsers.

NOTA: Para mejorar los indicadores de rendimiento en una app se usan el useMemo y el useCallback (en caso de una función), esto con el objetivo de evitar re-renderizados innecesarios.

==15.== Ahora para terminar se trabaja en el ordenar al dar click en la cabecera de cada columna para eso hay varias opciones que se pueden implementar. Una de las mas interesantes es usar un enum en los types así:

```ts
export enum SortBy {
  NONE = 'none',
  NAME = 'name',
  LAST = 'last',
  COUNTRY = 'country'
}
```

Para los estilos podemos emplear algo similar a esto:

```css
header{
  display: flex;
  gap: 4px;
  margin-bottom: 48px;
  justify-content: center;
  align-items: center;
}

.pointer{
 cursor: pointer;
}
```

La lógica para ordenar cada uno de los valores de acuerdon a la selección (nombre, apellido o país) se puede realizar haciendo uso de un Record, que es una forma de tipar un objeto y así podemos ahorrar alguna lódica y líneas de código. Record es algo similar a un diccionario:

```js
const sortedUsers = useMemo(() => {
    console.log('calculating sorted')
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

```


Para el HTML no olvidar importar la nueva función como prop:

```js
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
                ...
```

### Para probar la app

Una vez descargado el repo, ejectuamos en la consola el comando: ```bash npm i && npm run dev``` y damos click en http://localhost:5173/ y listo!