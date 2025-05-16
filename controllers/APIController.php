<?php

namespace Controllers;

use Model\Servicio;
use Model\Cita;
use Model\CitaServicio;

class APIController{
    public static function index(){
        $servicos = Servicio::all();

        echo json_encode($servicos);
    }

    public static function guardar(){
        // $respuesta = [
        //     'datos' => $_POST
        // ];
        //almacena la cita y devuelve el id




        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        $id = $resultado['id'];
        //almacena los servicios con el id de la cita
        $idServicios = explode(",", $_POST['servicios']);
        foreach($idServicios as $idServico){
            $args = [
                'citaId' => $id,
                'servicioId' => $idServico
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        };
        //retornar respuesta
        // $respuesta = [
        //     'resultado' => $resultado
        // ];

        // $respuesta = [
        //     'cita' => $cita
        // ];

        echo json_encode(['resultado' => $resultado]);
    }
    public static function eliminar(){
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $id = $_POST['id'];

            $cita = Cita::find($id);

            $cita->eliminar();

            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}