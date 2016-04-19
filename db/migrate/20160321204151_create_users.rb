class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login, null: false, index: {unique: true}
      t.string :email, index: {unique: true}

      t.string :crypted_password, null: false
      t.string :password_salt, null: false

      t.string :persistence_token

      t.timestamps null: false    end
  end
end
