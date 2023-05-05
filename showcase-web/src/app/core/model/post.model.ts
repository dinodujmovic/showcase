import { User } from "./user.model";

export interface Post {
    id: number;
    videoUrl: string;
    description: string;
    datetime: string;
    user: User;
}

export interface PostResponse {
    count: number;
    data: Post[];
}
