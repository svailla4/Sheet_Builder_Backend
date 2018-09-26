exports.generateCurrentTimePlus = (additionalMinutes=0)=>{
    return new Date().getTime() + additionalMinutes* 60 * 1000
}