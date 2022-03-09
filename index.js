const core = require('@actions/core');
const glob = require('glob');

//const m2Folder = "/tmp/m2";
//console.log("m2Folder: ", m2Folder);

const pathToScan = core.getInput('path-to-scan') || '';
const gthubToken = core.getInput('gthub-token') || '';

console.log('pathToScan: ', pathToScan);
console.log('gthubToken: ', gthubToken);

glob(pathToScan + '/**/*.jar', {}, (err, jarFiles)=>{
	for (const jarFile of jarFiles) {  
		var filePath = require('path').dirname(jarFile);
		glob(filePath + '/*.pom', {}, (err, pomFiles)=>{
			//pomFile = pomFiles;
            
			for (const pomFile of pomFiles) {
				console.log(jarFile);
				console.log(pomFile);

				let mvn = require('node-maven-api').create(pomFile);
				mvn.execCommand('my-custom-event', 'deploy:deploy-file -e -Durl="https://maven.pkg.github.com/MavenOSSGovernance/MavenOSSGovernance" -DrepositoryId="github" -Dfile=jarFile  -Dregistry="https://maven.pkg.github.com/" -Dtoken="' + gthubToken + '" -s $GITHUB_WORKSPACE/maven/settings.xml -DpomFile=pomFile');
			}
		})
	} 
});