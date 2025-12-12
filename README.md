<img src="public/img/logo.png" alt="Logo" align="right" width="20%">

&nbsp;

# NutriWise. Tu app de planificación nutricional saludable.

NutriWise es la app que necesitas para planificar tus comidas semanales de manera saludable. Con NutriWise ya no tendrás que andar preocupandote de hacerte la pregunta "¿Qué voy a comer hoy?", ya que con la planificación semanal de la app sabrás a todo momento que es lo que te toca comer o cocinar.

NutriWise además cuenta con una lista de la compra, que añade los productos que necesites para realizar tus comidas semanales y así nunca se te olivide ninguno de los ingredientes necesarios para tus recetas de la semana.

NutriWise te ayuda también a realizar un conteo de las calorías y macronutrientes que necesites o te pongas como objetivo para esa semana.

¡NutriWise tambien se acuerda de los poco originales en la cocina! NutriWise cuenta con amplio apartado de menús preestablecidos, por lo que ni si quiera necesitarás pensar que recetas hacer. 

## Descripción

NutriWise es un proyecto cuyo fin es ayudar a mantener un planificación semanal de tus comidas, que además incluye información nutricional sobre las comidas que añades a tu planificador. Cuenta también con una lista de la compra a la que puedes añadir los ingredientes que no tengas a la hora de crear un menú. De todos modos esta lista de la compra no está limitada a solo esta funcionalidad, sino que podrás añadir todo lo que tú desees a la lista.

## Instalación / Puesta en marcha

Hay dos maneras de probar la aplicación:

### Opción 1: Probar localmente con Railway

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/a23davidbc.git
cd a23davidbc
```
2. Crea un proyecto en [Railway](https://railway.com/) y añade un servicio de MongoDB.

Configura las variables de entorno necesarias (MONGO_URL o MONGO_URI según tu configuración).

Despliega el proyecto en Railway. La aplicación arrancará automáticamente y estará accesible desde la URL que proporciona Railway.

### Opción 2: Acceso directo para maintainers

Si eres maintainer del proyecto, no necesitas configurar nada:
Simplemente accede a la URL del proyecto en Railway y la aplicación ya estará funcionando.

> Nota: También existe la opción de levantar la aplicación localmente con Docker usando docker-compose up --build, pero Railway simplifica todo el proceso.

## Uso

La funcionalidad de NutriWise es muy sencilla. Una vez registrados o logueados, tenemos 3 apartados: Creacion de menús, el planning semanal y la lista de la compra.

En la creación de menús crearemos nuestros menus, donde le daremos un nombre y describiremos nuestros platos y añadimos los ingredientes si queremos.

En la parte del planning añadimos estos menus creados anteriormente, donde podremos seleccionar que ingredientes tenemos o no tenemos para que se añadan directamente a la cesta. Una vez añadido al planning podemos marcar el menú como "comido", eliminarlo o si hacemos click ver un resumen nutricional del mismo.

Finalmente en la página de la lista de la compra, veremos la lista con los productos que se han añadido directamente desde el planning o podemos añadir unos nuevos. Igualmente, podemos borrar elementos y marcarlos como "comprados".

## Sobre el autor

¡Hola! Soy David Blanco, el creador de este proyecto. Soy un estudiante de Desarrollo de Aplicaciones Web, que se encuentra realizando este proyecto para su Proyecto Fin de Ciclo. En este proyecto nos hemos decantado por unas tecnologías de JavaScript, ya que es uno de los lenguajes de programación en los que más comodo me siento. Me he decantado por NutriWise, ya que quería realizar una aplicación sencilla de seguimiento nutricional para mi dia a dia y las verisones que yo me había encontrado en la web no eran de mi agrado.

Si quisieran saber más de mi pueden contactar conmigo en mi [correo electronico personal](mailto:blanco3212@gmail.com)


## Licencia

Para la licencia del proyecto puedes visitar el archivo [LICENSE](LICENSE)

## Documentación

Este proyecto dispone de [una documentación más extensa](doc/doc.md) del proyecto que recomiendo revisar.

## Guía de contribución

¡Gracias por querer contribuir a **Nutriwise**! 🙌 Sea cual sea tu propósito:

- Añadir nuevas funcionalidades a la aplicación
- Corregir errores
- Mejorar la documentación
- Sugerir mejoras o nuevas ideas

Por favor, haz un **fork** del repositorio, crea una rama para tus cambios y abre un **pull request**. Asegúrate de que tu código funcione correctamente y siga las convenciones de estilo del proyecto.
