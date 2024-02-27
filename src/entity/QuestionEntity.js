
export class AnswerEntity {
  constructor (id, text) {
    this.id = id
    this.text = text
  }
}

export class QuestionEntity {
  constructor (id, type, content, answers, isMultiple, closeTime) {
    // 質問ID
    this.id = id
    // 質問タイプ(予約)
    this.type = type
    // 質問内容
    this.content = content
    // 回答群
    this.answers = answers
    // 複数回答フラグ
    this.isMultiple = isMultiple
    // 回答期限
    this.closeTime = closeTime
  }
}

