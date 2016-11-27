module.exports = (Obj) => {
  return new Promise((resolve, reject) => {
    let searchObj = {adopted: false}
    if (Obj.name) {
      searchObj.name = Obj.name
    }
    if (Obj.adopted) {
      searchObj.adopted = Obj.adopted
    }
    resolve(searchObj)
  })
}
