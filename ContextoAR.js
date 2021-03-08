import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
THREEx.ArToolkitContext.baseURL = '../PrototipoObraConcursoCCEBA2021/';
export class ContextoAR{
    constructor(mundo){
        this.mundo = mundo;
        //------- AR Toolkit Source, es decir lo que la camara ve
        this.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType : 'webcam',
             sourceWidth: 720,
             sourceHeight: 1280,
            displayWidth: window.innerHeight,
            displayHeight: window.innerinnerWidth    
        });
        //--- El source se inicializa en un proceso por separado
        var tmpresize = this.onResize;
        var tmparToolkitSource = this.arToolkitSource;
        var tmparToolkitContext = this.arToolkitContext;
        var tmprenderizador = mundo.renderizador;
        this.arToolkitSource.init(function onReady(){
            // necesitamos una funcion para cambiar el tamaño de la ventana cuando se inicia la camara
            setTimeout(function() {
                tmpresize(tmparToolkitSource,tmparToolkitContext,tmprenderizador);
            }, 2000);
        });
        window.addEventListener('resize', function(){
            tmpresize(tmparToolkitSource,tmparToolkitContext,tmprenderizador);
        });

        // agregamos este evento para cuando los marcadores nft acabaron de cargar nos avisa
       window.addEventListener('arjs-nft-loaded', function(ev){
         console.log(ev);
       })

        //-------- AR Toolkit Context
        this.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'camera_para.dat',
            detectionMode: 'mono',
            canvasWidth: window.innerHeight,
            canvasHeight: window.innerWidth
        });
        //-- inicializar
        var tmparToolkitContext = this.arToolkitContext;
        this.arToolkitContext.init(function onCompleted(){
            // copy projection matrix to camera
            mundo.camara.projectionMatrix.copy( tmparToolkitContext.getProjectionMatrix() );
        });


    }

    crearDescriptor(archivo, nombre){
        var raizDelMarcador = new THREE.Group;
        raizDelMarcador.name = nombre;
        this.mundo.escena.add(raizDelMarcador)
        this.markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, raizDelMarcador, {
            type : 'nft',//natural feature tracking
            descriptorsUrl  : THREEx.ArToolkitContext.baseURL + archivo,
            changeMatrixMode: 'modelViewMatrix'
        });
        return raizDelMarcador;
    }

    onResize(arToolkitSource,arToolkitContext,renderizador){
        if(arToolkitSource.domElement!== null && arToolkitContext !== undefined){
            arToolkitSource.onResizeElement();
            arToolkitSource.copyElementSizeTo(renderizador.domElement);
            if( arToolkitContext.arController !== null ){
                arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
            }
        }
    }

    actualizar(){
        if( this.arToolkitSource.ready === false )	return;
    	this.arToolkitContext.update( this.arToolkitSource.domElement );
    }
}
