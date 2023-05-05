import { GetUserDto, GetUserRawDto } from './user.dto';

function getUserRawToUserDto(user: GetUserRawDto) {
  const userDto: GetUserDto = {
    id: user.u_id,
    username: user.u_username,
    email: user.u_email,
    profileImg: user.u_image_url,
    role: user.r_name,
  };

  return userDto;
}

function getUsersRawToUsersDto(users: GetUserRawDto[]): GetUserDto[] {
  const usersDto: GetUserDto[] = [];

  users.forEach((user: GetUserRawDto) => {
    usersDto.push(getUserRawToUserDto(user));
  });

  return usersDto;
}

export {
  getUserRawToUserDto,
  getUsersRawToUsersDto,
};
