export class StatusService {
    
}

export class FeedPageService {

}

export class StoryPageService {

}

export class PostStatusService {

}

public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void>  // keep the 2-second pause
public async loadMoreFeedItems(authToken: AuthToken, userAlias: string,
  pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]>
public async loadMoreStoryItems(/* same parameters */): Promise<[Status[], boolean]>