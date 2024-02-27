
export class SpaceEntity {

  constructor (id, name, desc, openedDate, closeDate, roomImg) {
    this.id = id
    this.name = name
    this.desc = desc
    this.openedDate = openedDate
    this.closeDate = closeDate
    this.roomImg = roomImg
  }
  static from({id, name, desc, openedTime, closeTime}) {
    const openedDate = new Date(new Date().setTime(openedTime))
    const closeDate = new Date(new Date().setTime(closeTime))
    return new SpaceEntity(
      id, name, desc, openedDate, closeDate, null
    )
  }
}
