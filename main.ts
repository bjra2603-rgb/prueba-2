// Traducción a JavaScript (MakeCode) del juego micro:bit
let puntos = 0
let velocidad = 500 // tiempo máximo de reacción en ms
let juego_activo = false

function apagar_leds() {
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 0)
    pins.digitalWritePin(DigitalPin.P2, 0)
}

function iniciar_juego() {
    puntos = 0
    velocidad = 500
    juego_activo = true
    basic.showString("3-2-1-YA!")
    apagar_leds()
}

function game_over() {
    juego_activo = false
    apagar_leds()
    basic.showString("Puntos:" + puntos)
    basic.showIcon(IconNames.Sad)
    basic.pause(800)
    basic.clearScreen()
}

function esperar_liberacion_ab() {
    while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
        basic.pause(10)
    }
}

// Bucle principal (usar on_forever)
basic.forever(function () {
    // Iniciar juego con A+B
    if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
        iniciar_juego()
        esperar_liberacion_ab()
    }

    // Juego activo: bucle interno
    while (juego_activo) {
        // Elegir LED aleatorio (0,1,2)
        let led_num = Math.randomRange(0, 2)

        // Encender el LED correspondiente (pines externos P0,P1,P2)
        if (led_num == 0) {
            pins.digitalWritePin(DigitalPin.P0, 1)
        } else if (led_num == 1) {
            pins.digitalWritePin(DigitalPin.P1, 1)
        } else {
            pins.digitalWritePin(DigitalPin.P2, 1)
        }

        if (led_num == 2) {
            let reacciono = false
            let tiempo_espera = velocidad

            // Comprobar reacción cada 10 ms
            while (tiempo_espera > 0) {
                if (input.buttonIsPressed(Button.A)) {
                    reacciono = true
                    // esperar liberación para evitar múltiples detecciones
                    while (input.buttonIsPressed(Button.A)) {
                        basic.pause(10)
                    }
                    break
                }
                basic.pause(10)
                tiempo_espera -= 10
            }

            apagar_leds()

            if (reacciono) {
                puntos += 1
                velocidad = Math.max(200, velocidad - 20)
                basic.showIcon(IconNames.Yes)
                basic.pause(300)
                basic.clearScreen()
            } else {
                game_over()
                break
            }
        } else {
            // No es objetivo: mostrar y apagar
            basic.pause(velocidad)
            apagar_leds()
            basic.pause(100)
        }

        // Mostrar puntos cada 3 puntos
        if (puntos > 0 && puntos % 3 == 0) {
            basic.showString("" + puntos)
            basic.pause(200)
            basic.clearScreen()
        }
    }

    // Animación de espera cuando no hay juego activo
    if (!juego_activo) {
        basic.showIcon(IconNames.West)
        basic.pause(800)
        basic.clearScreen()
        basic.pause(800)
    }
})