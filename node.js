#!/usr/bin/env node



var path = require('path'), fs=require('fs');

function fromDir(startPath,filter){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);

    //var i=0;
    //while (i<files.length){

    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            //console.log('-- found: ',filename);
            //trouve
            return filename;
        };

        //i+=1;
    };
};

var fichier = fromDir('./','.html');
console.log ("fichier HTML trouvé :" + fichier);


var scriptJS = '<script type="text/javascript">'
        + 'function getQuerystring(key, default_) {'
        + 'if (default_==null) default_="";'
        + 'key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");'
        + 'var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");' 
        + 'var qs = regex.exec(window.location.href);' 
        + 'if(qs == null) return default_; else return qs[1];'
        + '}' 
        + 'var lien = getQuerystring("lien");'
        + 'function clickTag(){'
        + 'window.open(lien);'
        + '}' 
    + '</script>';

fs.readFile(fichier, 'utf8', function(error, data) {


    
    data = data.replace("<body", '<style>\nbody {cursor:pointer;}\n</style>\n<body onclick="clickTag()" ');
    data = data.replace("</body>", scriptJS + " </body>")

        fs.writeFile(fichier, data,
            function (error){
                if (error) throw error;
            }
            //
        );

        console.log('opération terminée...');

    
});