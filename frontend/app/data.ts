import { CharmProduct, TeamMember, ValueCard } from './types';

export const CHARM_PRODUCTS: CharmProduct[] = [
  {
    id: 'astra',
    name: 'Charm Astra',
    badge: 'Unique',
    tagline: 'Own your unique name, ignite your inner flame.',
    description: 'A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.',
    extendedDesc: 'Thiết kế cá nhân hóa chữ ký trực quan hoặc tên viết tắt đính kèm cấu trúc tinh thể vũ trụ độc đáo giúp truyền tải nguồn năng lượng tự tin, bản lĩnh độc nhất của chính dòng tộc sao bạn.',
    color: '#3b82f6', // blue
    brandColor: 'blue',
    iconName: 'Sparkles',
  },
  {
    id: 'sirius',
    name: 'Charm Sirius',
    badge: 'Passion',
    tagline: 'Pack the joy you seek, let your passion speak.',
    description: 'Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.',
    extendedDesc: 'Một chiếc bùa may mắn chứa đựng niềm vui bé nhỏ trong cuộc sống thường nhật, các loài thú cưng trung thành hay những thói quen yêu quý nuôi dưỡng xúc cảm rực rỡ và đam mê bùng cháy.',
    color: '#eab308', // yellow
    brandColor: 'yellow',
    iconName: 'Heart',
  },
  {
    id: 'polaris',
    name: 'Charm Polaris',
    badge: 'Inspiring',
    tagline: 'Trust the guiding quote, let your spirit float.',
    description: 'Inspiring quotes that serve as a guiding compass for your soul.',
    extendedDesc: 'Tác phẩm khắc ghi những câu châm ngôn truyền động lực sống mạnh mẽ, hoạt động như một chiếc la bàn định vị cho linh hồn của bạn, nâng đỡ bản ngã giữa đại dương vô cực.',
    color: '#ef4444', // red
    brandColor: 'red',
    iconName: 'Compass',
  }
];

export const CORE_VALUES: ValueCard[] = [
  {
    letter: 'Y',
    title: 'You-nique',
    subtitle: 'Bản Sắc Độc Bản',
    vietnameseTitle: 'Tôn vinh bản sắc độc bản.',
    description: 'Vũ trụ của bạn là duy nhất và không thể bị sao chép hay rập khuôn bởi bất kỳ ai.'
  },
  {
    letter: 'O',
    title: 'Out-of-the-box',
    subtitle: 'Tư Duy Đột Phá',
    vietnameseTitle: 'Không ngại tùy biến, không ngại điên rồ.',
    description: 'Thách thức mọi giới hạn khuôn mẫu để bạn tự do sáng chế và kiến tạo riêng phong cách mình.'
  },
  {
    letter: 'U',
    title: 'Unconditional connection',
    subtitle: 'Kết Nối Vô Điều Kiện',
    vietnameseTitle: 'Hòa hợp cái tôi cá nhân với thế giới.',
    description: 'Trực quan hóa những kết nối tâm hồn sâu sắc thông qua những mẩu chuyện nhỏ li ti kỳ thú kể trên từng nét charm tinh xảo.'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ms. Nguyễn Linh Chi',
    phone: '0335173280',
    role: 'Project Leader'
  },
  {
    name: 'Mr. Trần Hải Đăng',
    phone: '0795722279',
    role: 'Lead of Digital Media & Website'
  },
  {
    name: 'Ms. Quách Khả Thi',
    phone: '0858062402',
    role: 'Lead of Market Research & Insights'
  },
  {
    name: 'Ms. Nguyễn Lý An Nhiên',
    phone: '0334230606',
    role: 'Lead of Operations'
  },
  {
    name: 'Ms. Nguyễn Đỗ Như Hà',
    phone: '0943484784',
    role: 'Lead of Research & Development'
  },
  {
    name: 'Ms. Lê Nữ Đan Vy',
    phone: '0914575205',
    role: 'Lead of Sales'
  },
  {
    name: 'Ms. Dương Ngọc Phương Nghi',
    phone: '0346229446',
    role: 'Production Manager'
  },
  {
    name: 'Ms. Trần Ngọc Thư',
    phone: '0913450445',
    role: 'Lead of Public Relations'
  }
];
