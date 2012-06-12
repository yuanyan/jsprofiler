define(function(require, exports, module){

    var Cover = require('./runtime/cover');
    // document.getElementById("code")

    //var default_text = "";
    var editor = CodeMirror.fromTextArea(document.getElementById("code"));
    //editor.setValue(default_text);

    var heat = document.getElementById("heat"),
        heated = false,
        tooltip = document.querySelector('.tooltip'),
        isHide =false,
        coverage = document.getElementById("coverage");

    heat.onclick = function(){

        if(!isHide) {
            tooltip.style.display = "none";
            isHide = true;
        }

        if(heated) {
            heated = false;
            heat.innerHTML = "profile";
            coverage.innerHTML = "";
            var heatmapCanvas = document.querySelector(".CodeMirror > canvas");
            heatmapCanvas.parentNode.removeChild(heatmapCanvas);
            return;
        }

        var source = editor.getValue(), cover = new Cover();
        var coverData = cover.run(source),
            coverageData = cover.coverage();

        var max= 1,data=[];
        Object.keys(coverData).forEach(function (key) {
            var c = coverData[key];
            var count= c.times;
            if(count > max) max = count;

            var point = { x: c.node.start.col * 7 + 7, y: (c.node.start.line+1) * 13 - 6, count: count};
            data.push(point);
            //console.log(count, c.node.start, c.node.source());

        });
//        {max: 90, data: [
//            {x: 100, y: 100, count: 80},
//            {x: 120, y: 120, count: 60}
//        ]}

        var mirror= document.getElementsByClassName("CodeMirror")[0];
//        pre.innerText = source;
//        prettyPrint();


        // gen heat map
        var heatmap = heatmapFactory.create({"element":mirror, "radius":25, "visible":true});
        heatmap.store.setDataSet( {max:max, data:data} );

        heated = true;
        heat.innerHTML = "return";

        coverage.innerHTML = (coverageData*100).toFixed(1)+"%";

        console.log('heatmap: ', {max:max, data:data} );
        console.log('coverData: ', coverData );
        console.log('coverage: ', coverageData );

    };



});