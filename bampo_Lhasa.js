var fs=require('fs');
var match="བམ་པོ";
var search_pb="<pb id=";
var stop="།";
var lineoffset;
var line;
var pb;
//找出བམ་པོ所在的行號
//找出來之後回頭找最接近的pb的位置
//兩行互減+1則是lineoffset
//前面補上pb就ok啦～

var trimid=function(id,ends){
	var q=id.indexOf(ends);
	if(q>-1){
		id=id.substr(0,q);
	}
	return id; 
}

var processFile=function(file){
	var filename=fs.readFileSync(file,"utf8").split(/\r?\n/);
	for(var i=0; i<filename.length; i++){
		var eachline=filename[i];
		var nextline=filename[i+1];
		var find_pb=eachline.indexOf(search_pb)
		if(find_pb>-1){
			lineoffset=i;
			pb=trimid(eachline.substr(find_pb+8,8),'"');
		}
		var find_bampo=eachline.indexOf(match);
		if(find_bampo>-1){
			line=i-lineoffset+1;
			var bampo=trimid(eachline.substr(find_bampo,50),"།");
			if(bampo.indexOf("<li")>-1){
				var b=eachline.substr(find_bampo)+trimid(nextline,"།");
				bampo=b.replace("<line/>","");
			}
			if(bampo.indexOf("<pb")>-1){
				bampo=bampo.substr(0,bampo.indexOf("<pb"));
			}
			console.log(bampo+":"+pb+line);
		}
	}
}

var file=fs.readFileSync("filelist.xml","utf8").split(/\r?\n/);
for(var i=0; i<file.length; i++ ){
	var eachfile=file[i];
	console.log(eachfile);
	processFile(eachfile);
	
}