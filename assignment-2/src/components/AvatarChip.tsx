import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { getProfilePhotoFor } from '../Services/UserServices';

export default function AvatarChip({id, name}: any) {
  return (
    <Chip avatar={<Avatar alt={name} src={getProfilePhotoFor(id)} />} label={name} />
  );
}