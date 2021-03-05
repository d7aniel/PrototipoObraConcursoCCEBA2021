import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
export class MundoAR{
    constructor(){
        this.camara = new THREE.PerspectiveCamera();//--- para AR sin parametros y en posicion y rotacion 0,0,0
        this.escena = new THREE.Scene();
        this.escena.add(this.camara);//--- para AR Agregar la camara a la escena

        //
        this.renderizador = new THREE.WebGLRenderer( { antialias: true, alpha:true, logarithmicDepthBuffer: true } );// para ar alpha y logarithmicDepthBuffer
        this.renderizador.setPixelRatio( window.devicePixelRatio );
        this.renderizador.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderizador.domElement );
    }

    dibujar(){
        this.renderizador.render(this.escena,this.camara);
    }

    iluminar(){
        const luz1 = new THREE.PointLight( 0xff0000, 2, 100 );
        luz1.position.set(1,1,2);
        this.escena.add( luz1 );

        const luz2 = new THREE.PointLight( 0x00ffff, 1, 100 );
        luz2.position.set(1,1,-2);
        this.escena.add( luz2 );

        const ambiental = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.escena.add( ambiental );
    }

    iluminarConFoto(archivo, conFondoVisible){
        var pmremGenerator = new THREE.PMREMGenerator( this.renderizador );
        pmremGenerator.compileEquirectangularShader();

        new THREE.TextureLoader().load( archivo, ( texture ) => {
            var iluminacion = pmremGenerator.fromEquirectangular( texture );
            this.escena.environment = iluminacion.texture;
            if(conFondoVisible){
                this.escena.background = iluminacion.texture;
            }
            texture.dispose();
            pmremGenerator.dispose();
        });
    }


}
