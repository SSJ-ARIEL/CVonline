# Preferencias permanentes del propietario de CVonline

Las actualizaciones habituales deben conservar el dominio y la configuración de
AdSense y Google Search Console. No cambies el ID del propietario, el fragmento
de AdSense, `ads.txt`, el archivo HTML de verificación de Google ni el origen del
sitemap salvo que el propietario lo solicite explícitamente. Mantén esos archivos
en futuros despliegues y el sitemap actualizado cuando cambien las páginas.

En cambios de fondos de currículum, conserva los acentos elegidos, círculos,
decoraciones, tipografías, geometría e identificadores de los diseños. Modifica
solo lo necesario para la petición y para mantener el texto legible. Los fondos
deben coincidir en las miniaturas, la vista previa y las exportaciones PDF y Word.

La web se publica en el proyecto Cloudflare Pages existente `cvonline`, cuya URL
es `https://cvonline-zw0.pages.dev`. GitHub conserva el código; los despliegues
utilizan Direct Upload. No crees otro proyecto para una actualización habitual.
El propietario gestiona la verificación, revisión y demás acciones de sus cuentas
de Google. Nunca guardes credenciales en el repositorio.

Las reescrituras privadas de Pages deben apuntar a `/editor` sin extensión:
`/editor.html` provoca una redirección canónica y cambia la URL del formulario.
Valida las rutas con el servidor de Pages de Wrangler, además de los recorridos
del navegador. `CI=true npm test -- --retries=0` lo utiliza automáticamente;
`CVONLINE_TEST_CLOUDFLARE=true` también permite seleccionarlo fuera de CI.
