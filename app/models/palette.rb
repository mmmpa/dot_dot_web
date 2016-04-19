class Palette < ActiveRecord::Base
  belongs_to :user
end

# == Schema Information
#
# Table name: palettes
#
#  id         :integer          not null, primary key
#  raw        :text
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_palettes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_a251d8a78d  (user_id => users.id)
#
