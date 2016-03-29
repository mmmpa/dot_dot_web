class Picture < ActiveRecord::Base
  belongs_to :user
end

# == Schema Information
#
# Table name: pictures
#
#  id         :integer          not null, primary key
#  path       :string
#  user_id    :integer
#  public     :boolean
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_pictures_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_3268570edc  (user_id => users.id)
#
