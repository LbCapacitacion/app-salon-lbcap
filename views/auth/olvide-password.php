<h1 class="nombre-pagina">Olvidé Password</h1>
<p class="descripcion-pagina">Restablece tu password escribiendo tu email a continuacion</p>

<?php
include_once __DIR__ . '/../templates/alertas.php';

?>
<form action="/olvide" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email :</label>
        <input type="email" id="email" name="email" placeholder="Tu email">
    </div>
    <input type="submit" value="Enviar Instrucciones" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesion</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear una</a>
</div>