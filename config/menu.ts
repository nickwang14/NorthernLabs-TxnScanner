export interface Social {
  name: string
  link: string
}

export type SocialId = 'github' | 'twitter'

const socials: { [key in SocialId]: Social } = {
  github: {
    name: 'GitHub',
    link: 'https://github.com/nickwang14',
  },
  twitter: {
    name: 'Twitter',
    link: 'https://x.com/definitelynickw',
  },
}

export const socialsArray: Social[] = Object.values(socials)
