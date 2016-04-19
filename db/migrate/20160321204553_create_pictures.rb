class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.string :path
      t.references :user, index: true, foreign_key: true
      t.boolean :public

      t.timestamps null: false
    end
  end
end
