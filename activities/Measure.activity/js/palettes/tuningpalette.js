define(["sugar-web/graphics/palette"], function (palette) {

    var tuningpalette = {};

    tuningpalette.TuningPalette = function (invoker, primaryText) {
        palette.Palette.call(this, invoker, primaryText);

        var template =
            `
            <div style="margin: 10px;">
                <button id="harmonics-on-button" class="toolbutton" onclick="app.handleHarmonics()" style="border-radius: 10px;height: 55px;width: 55px;"></button>
                <button id="harmonics-off-button" class="toolbutton" onclick="app.handleHarmonics()" style="border-radius: 10px;height: 55px;width: 55px;"></button>
            </div>
        `;

        var containerElem = document.createElement('div');
        containerElem.innerHTML = template;
        this.setContent([containerElem]);
    };

    var addEventListener = function (type, listener, useCapture) {
        return this.getPalette().addEventListener(type, listener, useCapture);
    };

    tuningpalette.TuningPalette.prototype = Object.create(palette.Palette.prototype, {
        addEventListener: {
            value: addEventListener,
            enumerable: true,
            configurable: true,
            writable: true
        }
    });

    return tuningpalette;
});
