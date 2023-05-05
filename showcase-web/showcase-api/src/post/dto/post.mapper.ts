import { GetPostDto, GetPostRawDto } from './post.dto';

function getPostRawToPostDto(post: GetPostRawDto) {
  const postDto: GetPostDto = {
    id: post.p_id,
    videoUrl: post.p_video_url,
    description: post.p_description,
    datetime: post.p_datetime,
    user: {
      id: post.u_id,
      username: post.u_username,
      email: post.u_email,
      profileImg: post.u_image_url,
      role: post.r_name,
    },
  };

  return postDto;
}

function getPostsRawToPostsDto(posts: GetPostRawDto[]): GetPostDto[] {
  const postsDto: GetPostDto[] = [];

  posts.forEach((post: GetPostRawDto) => {
    postsDto.push(getPostRawToPostDto(post));
  });

  return postsDto;
}

export {
  getPostRawToPostDto,
  getPostsRawToPostsDto,
};
