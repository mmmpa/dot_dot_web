class User < ActiveRecord::Base
  acts_as_authentic do |config|
    config.login_field = :login
    config.require_password_confirmation = false
    config.validate_email_field = false
  end
end

# == Schema Information
#
# Table name: users
#
#  id                :integer          not null, primary key
#  login             :string           not null
#  email             :string
#  crypted_password  :string           not null
#  password_salt     :string           not null
#  persistence_token :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#  index_users_on_login  (login) UNIQUE
#
