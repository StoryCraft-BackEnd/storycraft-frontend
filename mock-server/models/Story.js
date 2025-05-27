/**
 * 동화 모델
 * 동화의 기본 정보를 정의합니다.
 */

class Story {
  constructor(storyId, title, summary, thumbnailUrl, createdAt, updatedAt) {
    this.storyId = storyId;
    this.title = title;
    this.summary = summary;
    this.thumbnailUrl = thumbnailUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJSON(json) {
    return new Story(
      json.storyId,
      json.title,
      json.summary,
      json.thumbnailUrl,
      json.createdAt,
      json.updatedAt
    );
  }

  toJSON() {
    return {
      storyId: this.storyId,
      title: this.title,
      summary: this.summary,
      thumbnailUrl: this.thumbnailUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Story;
