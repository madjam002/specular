const all = []
const beatBased = []

export var AnimationRegistry = {

  all,
  beatBased,

  add(animation, isBeatBased = no) {
    all.push(animation)
    if (isBeatBased) beatBased.push(animation)
  },

  remove(animation) {
    if (all.indexOf(animation) !== -1) all.splice(all.indexOf(animation), 1)
    if (beatBased.indexOf(animation) !== -1) beatBased.splice(beatBased.indexOf(animation), 1)
  },

  updateAll(time) {
    for (let anim of all) {
      anim.update(time)
    }
  },

}
