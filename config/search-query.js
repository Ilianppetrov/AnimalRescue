module.exports = (Obj) => {
  return new Promise((resolve, reject) => {
    let searchObj = {adopted: false}
    if (Obj.SearchName) {
      searchObj.name = Obj.SearchName
    }
    if (Obj.adopted) {
      searchObj.adopted = Obj.adopted
    }
    resolve(searchObj)
  })
}
